import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { Header } from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import { format } from '../../util/format';
import { Comments } from '../../components/Comments';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const words = post.data.content.reduce((prev, curr) => {
    const body = RichText.asText(curr.body);
    const wordArray = body.split(' ');
    return wordArray.length + prev;
  }, 0);

  const readingTime = Math.ceil(words / 183);

  const formattedHour = format(post.first_publication_date);

  return (
    <>
      <Header />
      <div className={styles.banner}>
        <Image
          src={post.data.banner.url}
          alt="Banner"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <main className={styles.post}>
        <h1>{post.data.title}</h1>
        <div className={styles.info}>
          <div>
            <FiCalendar size={20} />
            <small>{formattedHour}</small>
          </div>

          <div>
            <FiUser size={20} />
            <small>{post.data.author}</small>
          </div>

          <div>
            <FiClock size={20} />
            <small>{readingTime} min</small>
          </div>
        </div>

        <article className={styles.contentContainer}>
          {post.data.content.map(group => {
            return (
              <section className={styles.contentSection} key={group.heading}>
                <h2>{group.heading}</h2>
                <div
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(group.body),
                  }}
                />
              </section>
            );
          })}
        </article>
      </main>
      <footer className={styles.footer}>
        <div>
          <div>
            <p>Como utilizar Hooks</p>
            <a href="/">Post anterior</a>
          </div>
          <div>
            <p>Criando um app CRA do Zero</p>
            <a href="/">Próximo post</a>
          </div>
        </div>
        <Comments />
      </footer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts')
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', String(params.slug), {});

  return {
    props: { post },
  };
};
