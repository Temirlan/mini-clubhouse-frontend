import { FC } from "react";
import clsx from "clsx";
import styles from "./StepInfo.module.scss";

interface Props {
  icon: string;
  title: string;
  description?: string;
}

export const StepInfo: FC<Props> = ({ icon, title, description }) => {
  return (
    <div className={clsx(styles.block, "text-center")}>
      <div>
        <img className={styles.img} src={icon} alt="Step picture" />
      </div>
      <b className={styles.title}>{title}</b>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};
