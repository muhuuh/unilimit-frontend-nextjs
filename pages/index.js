import Head from "next/head";
import Unilimit from "./UniLimit";
import styles from "../styles/Home.module.css";
import Header from "./Header";
import ScrapingMain from "./ScrapingMain";
import HorizontalChart from "./Charts/HorizontalChart";
import HorizontalChart2 from "./Charts/HorizontalChart2";

export default function Home() {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>UniLimit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Unilimit />
      <HorizontalChart />
      <ScrapingMain />
    </div>
  );
}

export async function getServerSideProps() {
  console.log("run getServerSideProps()");

  // Pass data to the page via props
  return { props: { data: "test" } };
}
