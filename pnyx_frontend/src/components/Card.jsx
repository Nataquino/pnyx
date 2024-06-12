import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const BasicCard = () => {
  return (
    <Card
      sx={{
        minWidth: 275,
        height: "40vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ marginTop: 2, fontSize: "40px" }}
        >
          Genshin or Wuwa?
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          "Genshin" - Adventurous, fantastical journey through diverse
          landscapes, filled with mystical creatures and elemental powers.
          "Wuthering Waves" - A turbulent tale of love and loss set against the
          haunting backdrop of the moody Yorkshire moors.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button size="small">Answer survey</Button>
      </CardActions>
    </Card>
  );
};

export default BasicCard;
