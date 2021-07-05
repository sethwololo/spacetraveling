import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

  return (
    <>
      <Header />
      <Image src={post.data.banner.url} alt="Banner" layout="fill" />
      <main>
        <h1>{post.data.title}</h1>
        <div>
          <div>
            <small>{post.first_publication_date}</small>
          </div>

          <div>
            <small>{post.data.author}</small>
          </div>

          <div>
            <small>4 min</small>
          </div>
        </div>
      </main>
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
