import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <Link href="/" passHref>
        <a>
          <Image src="/logo.svg" width={238.62} height={25.63} alt="logo" />
        </a>
      </Link>
    </header>
  );
}
