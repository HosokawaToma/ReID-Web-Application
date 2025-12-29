import Link from "next/link";
import styles from "./index.module.css";

export default function Header() {
  return (
    <header>
      <div className={styles.headerContent}>
        <div className={styles.headerNavigation}>
            <Link href="/dashboard" className={styles.headerNavigationLink}>
              <div className={styles.headerNavigationItem}>Dashboard</div>
            </Link>
          <Link href="/personSnapshotsSearch" className={styles.headerNavigationLink}>
            <div className={styles.headerNavigationItem}>Person Snapshots Search</div>
          </Link>
          <Link href="/personFlowWeight" className={styles.headerNavigationLink}>
            <div className={styles.headerNavigationItem}>Person Flow Weight</div>
          </Link>
        </div>
      </div>
    </header>
  );
}
