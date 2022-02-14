import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A First meetup",
//     image:
//       "https://media.istockphoto.com/photos/group-of-women-talks-in-an-outdoor-yoga-meetup-picture-id1358731423?b=1&k=20&m=1358731423&s=170667a&w=0&h=ism7PUhIzq7IVRI8XS3XPAIlxBuqGEHOOjvwyYWXt44=",
//     address: "Some address 5, 12345 Some City",
//     description: "This is a first meetup!",
//   },
//   {
//     id: "m2",
//     title: "A Second meetup",
//     image:
//       "https://media.istockphoto.com/photos/group-of-women-talks-in-an-outdoor-yoga-meetup-picture-id1358731423?b=1&k=20&m=1358731423&s=170667a&w=0&h=ism7PUhIzq7IVRI8XS3XPAIlxBuqGEHOOjvwyYWXt44=",
//     address: "Some address 10, 12345 Some City",
//     description: "This is a second meetup!",
//   },
// ];
const Homepage = (props) => {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
        <title>React Meetups</title>
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fectch data fron an API - server side code.
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// Executed during build process, will not be accessible on client side, user can't access this.
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://next:nextjs@nodetuts.ml26d.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default Homepage;
