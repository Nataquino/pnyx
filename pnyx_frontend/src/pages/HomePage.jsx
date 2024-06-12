
import { Stack, Box} from "@mui/material";
import NavBar from "../components/NavBar";
import BasicCard from "../components/Card";

const HomePage = () => {
  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />  
      <Box sx={{marginLeft: 4, marginTop: 11, width: "30vw"  }}>
          <BasicCard/>
      </Box>

    </Stack>
  );
};
export default HomePage;
