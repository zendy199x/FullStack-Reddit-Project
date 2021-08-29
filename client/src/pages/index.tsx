import Navbar from '../components/Navbar';
import { PostsDocument, usePostsQuery } from '../generated/graphql';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

const Index = () => {
  const { data, loading } = usePostsQuery();

  return (
    <>
      <Navbar />
      {loading ? (
        'Loading...'
      ) : (
        <ul>
          {data?.posts?.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PostsDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Index;
