import { Container, Image } from "../../components";
import billsLogo from "../../assets/logos/bills-logo.svg";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      navigate("/home");
    } catch {
      return;
    }
  };

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
    </Container>
  );
};

export default Login;
