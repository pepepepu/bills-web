import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import billsLogo from "../../assets/logos/bills-logo.svg";
import { Button, Container, Image, Text } from "../../components";
import { PiUserCheckFill, PiUserPlusFill } from "react-icons/pi";

const Hero = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container
      height="100dvh"
      width={"100%"}
      flexDirection="column"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="40px 30px"
      backgroundColor={theme.colors.background}
    >
      <Image
        src={billsLogo}
        alt="Bills Logo"
        width={60}
        height={60}
        objectFit="contain"
      />

      <Container
        width={"100%"}
        display="flex"
        flexDirection="column"
        gap={"40px"}
      >
        <Container
          width={"100%"}
          display="flex"
          flexDirection="column"
          gap={"15px"}
        >
          <Text
            fontWeight={550}
            fontFamily={theme.fonts.body}
            letterSpacing={"-0.5px"}
            fontSize={"1.4rem"}
            lineHeight={"100%"}
            fontColor={theme.colors.text.title}
          >
            Organize suas contas com facilidade
          </Text>
          <Text
            fontWeight={400}
            fontFamily={theme.fonts.body}
            letterSpacing={"-0.5px"}
            fontSize={"1rem"}
            lineHeight={"100%"}
            fontColor={theme.colors.text.title}
          >
            Por que boleto bom, é boleto pago.
          </Text>
        </Container>

        <Container
          width={"100%"}
          display="flex"
          flexDirection="column"
          gap={"10px"}
        >
          <Button
            width={"100%"}
            padding={"15px 0"}
            backgroundColor={theme.colors.secondary}
            borderRadius={"99px"}
            border={`1px solid transparent`}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap={"10px"}
            color={theme.colors.background}
            onClick={() => navigate("/login")}
          >
            <PiUserCheckFill fontSize={"1.2rem"} />
            <Text>Entrar</Text>
          </Button>
          <Button
            width={"100%"}
            padding={"15px 0"}
            backgroundColor={"transparent"}
            border={`1px solid ${theme.colors.secondary}`}
            borderRadius={"99px"}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap={"10px"}
            color={theme.colors.secondary}
            onClick={() => navigate("/register")}
          >
            <PiUserPlusFill fontSize={"1.2rem"} />
            <Text>Criar conta</Text>
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default Hero;
