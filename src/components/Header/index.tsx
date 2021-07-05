import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../public/Logo.svg';
import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <Link href="/" passHref>
        <a>
          <Image src={logo} alt="logo" />
        </a>
      </Link>
    </header>
  );
}
