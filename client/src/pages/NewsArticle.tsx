import { Helmet } from 'react-helmet-async';

export default function NewsArticle({ slug }: { slug: string }) {
  return (
    <>
      <Helmet><title>Article | BOCRA</title></Helmet>
      <div className="container py-12"><h1 className="text-4xl font-bold">Article</h1><p className="text-lg text-bocra-text-secondary mt-4">Coming soon...</p></div>
    </>
  );
}
