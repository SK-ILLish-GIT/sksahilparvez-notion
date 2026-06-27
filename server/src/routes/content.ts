import { Router } from "express";
import { CONTENT_KEYS, type ContentKey } from "../config.js";
import { isAdminAuthenticated, isAdminEnabled } from "../lib/admin-auth.js";
import { SectionContent } from "../models/index.js";

export const contentRouter = Router();

function isContentKey(value: string): value is ContentKey {
  return (CONTENT_KEYS as readonly string[]).includes(value);
}

contentRouter.get("/", async (_req, res) => {
  try {
    const docs = await SectionContent.find({}).lean();
    const portfolio: Record<string, unknown> = {};

    for (const doc of docs) {
      portfolio[doc.key] = doc.data;
    }

    const sections = portfolio.sections;
    if (Array.isArray(sections)) {
      portfolio.sections = sections.filter(
        (section) =>
          section &&
          typeof section === "object" &&
          "visible" in section &&
          (section as { visible: boolean }).visible,
      );
    }

    res.json({
      portfolio,
      source: "mongodb",
      updatedAt: docs.reduce<string | null>((latest, doc) => {
        const iso = doc.updatedAt?.toISOString?.() ?? null;
        if (!iso) return latest;
        return !latest || iso > latest ? iso : latest;
      }, null),
    });
  } catch (error) {
    console.error("GET /api/content", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

contentRouter.get("/:key", async (req, res) => {
  try {
    const key = req.params.key;
    if (!isContentKey(key)) {
      res.status(404).json({ error: "Unknown content key" });
      return;
    }

    const doc = await SectionContent.findOne({ key }).lean();
    if (!doc) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    res.json({ key: doc.key, data: doc.data, updatedAt: doc.updatedAt });
  } catch (error) {
    console.error("GET /api/content/:key", error);
    res.status(500).json({ error: "Failed to fetch content section" });
  }
});

contentRouter.put("/:key", async (req, res) => {
  try {
    if (!isAdminEnabled()) {
      res.status(503).json({ error: "Content updates are disabled" });
      return;
    }

    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const key = req.params.key;
    if (!isContentKey(key)) {
      res.status(404).json({ error: "Unknown content key" });
      return;
    }

    if (req.body?.data === undefined) {
      res.status(400).json({ error: "Missing data in request body" });
      return;
    }

    const doc = await SectionContent.findOneAndUpdate(
      { key },
      { data: req.body.data, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    res.json({ key: doc.key, data: doc.data, updatedAt: doc.updatedAt });
  } catch (error) {
    console.error("PUT /api/content/:key", error);
    res.status(500).json({ error: "Failed to update content section" });
  }
});
