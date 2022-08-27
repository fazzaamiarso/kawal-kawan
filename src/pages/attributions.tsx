import { NextSeo } from "next-seo";

const Attributions = () => {
  return (
    <>
      <NextSeo title='Attributions' />
      <main className='layout mb-8'>
        <h1 className='mt-12 mb-6 text-2xl font-bold'>Attributions</h1>
        <p>
          All User Avatar comes from Dicebear API. Style used is Big Smile by Ashley Seo. Design
          Source{" "}
          <a
            href='https://www.figma.com/community/file/881358461963645496'
            className='text-blue-500 hover:underline'>
            here
          </a>{" "}
        </p>
      </main>
    </>
  );
};

export default Attributions;
