import { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { Header } from '../components/Header';
import { PostItem } from '../components/PostItem';

import { getPrismicClient } from '../services/prismic';

import { format } from '../util/format';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [postList, setPostList] = useState(
    postsPagination.results.map(post => ({
      ...post,
      first_publication_date: format(post.first_publication_date),
    }))
  );

  // const { next_page, results } = postsPagination;

  async function getMorePosts(): Promise<void> {
    const oldPosts = postList;
    const response = await fetch(nextPage);
    const newPosts = await response.json();

    const formattedNewPosts = newPosts.results.map(post => ({
      ...post,
      first_publication_date: format(post.first_publication_date),
    }));
    // console.log(posts);
    setNextPage(newPosts.next_page);

    setPostList([...oldPosts, ...formattedNewPosts]);
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <div className={styles.container}>
        <Header />

        <div className={styles.postList}>
          {postList.map(post => (
            <PostItem
              key={post.uid}
              link={post.uid}
              title={post.data.title}
              subtitle={post.data.subtitle}
              author={post.data.author}
              createdAt={post.first_publication_date}
            />
          ))}
        </div>

        {nextPage && (
          <button
            type="button"
            className={styles.loadPosts}
            onClick={getMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    { pageSize: 3 }
  );

  const { next_page, results } = postsResponse;

  return {
    props: {
      postsPagination: {
        next_page,
        results,
      },
    },
  };
};
