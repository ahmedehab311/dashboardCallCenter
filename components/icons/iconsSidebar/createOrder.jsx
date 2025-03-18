import OrderIcon from "./order-placed-purchased-icon.svg?react"; 
import { useTheme } from "next-themes";

const CreateOrder = () => {
  const { theme } = useTheme();
  const iconColor = theme === "dark" ? "#fff" : "#B197FC";

  return <OrderIcon fill={iconColor} width={20} height={20} />;
};

export default CreateOrder;

