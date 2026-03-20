import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | BOCRA</title>
        <meta name="description" content="Learn more about the Botswana Communications Regulatory Authority" />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-6">About BOCRA</h1>
        <p className="text-lg text-bocra-text-secondary">Coming soon...</p>
      </div>
    </>
  );
}
