import styles from "./PaymentBar.module.css";
import { formatNumberWithComma } from "@/shared/utils/number/utils";

interface PaymentBarProps {
  totalPrice: number;
  onClick: () => void;
}

export default function PaymentBar({
  totalPrice,
  onClick
}: PaymentBarProps) {

  const formattedPrice = formatNumberWithComma(totalPrice);

  return (
    <div className={styles.container}>
      <button
        onClick={onClick}
        className={styles.button}
      >
        <span className={styles.label}>{formattedPrice}원 결제하기</span>
      </button>
    </div>
  )
}