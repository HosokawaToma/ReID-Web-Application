import Link from "next/link";
import styles from "./index.module.css";

export default function Header() {
  return (
    <header>
      <div className={styles.headerContent}>
        <div className={styles.headerNavigation}>
          <Link href="/dashboard" className={styles.headerNavigationLink}>Dashboard</Link>
          <Link href="/personSnapshotsSearch" className={styles.headerNavigationLink}>Person Snapshots Search</Link>
          <Link href="/personFlowWeight" className={styles.headerNavigationLink}>Person Flow Weight</Link>
        </div>
      </div>
    </header>
  );
}
