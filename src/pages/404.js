import { Helmet } from 'react-helmet';
import Link from 'components/Link';
import Button from 'components/Button';
import Intro from './Intro';

const Page404 = () => (
  <div className="page-404">
    <Helmet>
      <title>404 | Device Models</title>
      <meta name="description" content="404 page not found. This page doesn't exist." />
    </Helmet>
    <Intro center title="Error 404" description="This page could not be found.">
      <Link secondary href="/" aria-label="Go Home">
        <Button primary>Go Home</Button>
      </Link>
    </Intro>
  </div>
);

export default Page404;
