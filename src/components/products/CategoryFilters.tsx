import { motion, AnimatePresence } from "framer-motion";
import { HorizontalScroll } from "./categoryFilter/HorizontalScroll";
import { CategoryFiltersProps } from "./types/category";
import { CategoryButton } from "./categoryFilter/CategoryButton";

const subCategoryVariants = {
  initial: { opacity: 0, scale: 0.8, rotate: -10 },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" },
  }),
  exit: (i: number) => ({
    opacity: 0,
    scale: 0.8,
    rotate: -10,
    transition: { duration: 0.2, delay: i * 0.03, ease: "easeIn" },
  }),
};

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, selected, onSelect }) => {
  return (
    <div className="mb-6">
      {/* carousel */}
      <HorizontalScroll>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <AnimatePresence>
            {categories.map((cat, index) => (
              <motion.div
                key={cat}
                custom={index}
                variants={subCategoryVariants}
                initial="initial"
                animate="animate"
                exit="exit">
                {/* subcategoria */}
                <CategoryButton
                  label={cat}
                  selected={selected === cat}
                  onClick={() => {
                    onSelect(cat);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </HorizontalScroll>
    </div>
  );
};
