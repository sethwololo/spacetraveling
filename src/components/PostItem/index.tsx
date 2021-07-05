import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './postitem.module.scss';

interface PostItemProps {
  title: string;
  subtitle: string;
  author: string;
  createdAt: string;
}

export function PostItem({
  title,
  subtitle,
  author,
  createdAt,
}: PostItemProps): JSX.Element {
  return (
    <Link href="/" passHref>
      <div className={styles.container}>
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <div className={styles.info}>
          <div>
            <FiCalendar size={20} />
            <small>{createdAt}</small>
          </div>
          <div>
            <FiUser size={20} />
            <small>{author}</small>
          </div>
        </div>
      </div>
    </Link>
  );
}
