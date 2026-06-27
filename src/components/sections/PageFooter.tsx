import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, GripVertical } from "lucide-react";
import { scrollToSection } from "@/lib/utils";
import { cn } from "@/lib/utils";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function PageFooter() {
  const reduceMotion = useReducedMotion();

  return (
    <footer
      aria-label="End of page"
      className="mt-4 pb-2 pt-8 sm:mt-6 sm:pt-10"
    >
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={reduceMotion ? undefined : stagger}
        className="flex flex-col items-center gap-5"
      >
        <motion.div
          variants={reduceMotion ? undefined : fadeUp}
          className="relative w-full origin-left"
        >
          <motion.div
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-px w-full origin-left bg-border"
          />
        </motion.div>

        <motion.div
          variants={reduceMotion ? undefined : fadeUp}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <GripVertical className="h-4 w-4 opacity-40" aria-hidden />
          <span className="text-xs tracking-wide">End of page</span>
          <GripVertical className="h-4 w-4 opacity-40" aria-hidden />
        </motion.div>

        <motion.div variants={reduceMotion ? undefined : fadeUp}>
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            data-cursor-hint="Back to top"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-all",
              "hover:border-primary/30 hover:bg-notion-hover hover:text-foreground hover:shadow-md",
              !reduceMotion && "hover:-translate-y-0.5",
            )}
          >
            <ArrowUp
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                !reduceMotion && "group-hover:-translate-y-0.5",
              )}
            />
            Back to top
          </button>
        </motion.div>
      </motion.div>
    </footer>
  );
}
