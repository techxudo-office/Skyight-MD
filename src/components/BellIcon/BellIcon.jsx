import { motion } from "framer-motion";
import { BellSound } from "../../assets/Index";


const BellIcon = ({ icon }) => {
    const playSound = () => {
        const audio = new Audio(BellSound);
        audio.play();
    };
    return (
        <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }} // Hover effect
            whileTap={{ rotate: [0, -15, 15, -15, 15, 0] }}  // Click effect
            transition={{ duration: 0.5, repeat: 1, ease: "easeInOut" }}
            className="cursor-pointer"
        // onMouseEnter={playSound}
        >
            {icon}
        </motion.div>
    );
};

export default BellIcon;