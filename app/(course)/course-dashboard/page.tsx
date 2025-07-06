import AddCourse from "./_components/AddCourse";
import ExplorePage from "./_components/ExplorePage";
import UserCourseList from "./_components/UserCourseList";

const page = () => {
  return (
    <div>
      <AddCourse />
      <UserCourseList />
      <ExplorePage />
    </div>
  );
};

export default page;
