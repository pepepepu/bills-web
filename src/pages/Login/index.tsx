import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "styled-components";
import {
  PiEnvelopeSimple,
  PiLockSimple,
  PiUserCheckFill,
} from "react-icons/pi";
import billsLogo from "../../assets/logos/bills-logo.svg";
import {
  Container,
  ErrorBanner,
  Form,
  Image,
  Input,
  Muted,
  PillButton,
  Text,
} from "../../components";
import { useAuth } from "../../hooks/useAuth";

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

  const inputStyle = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    onFocusBorderColor: theme.colors.primary,
    textColor: theme.colors.text.body,
    placeholderColor: theme.colors.text.muted,
    height: 52,
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

      <Container
        width={"100%"}
        style={{ maxWidth: 420 }}
        display="flex"
        flexDirection="column"
        gap={"30px"}
      >
        <Container display="flex" flexDirection="column" gap={"10px"}>
          <Text
            fontWeight={550}
            fontFamily={theme.fonts.body}
            letterSpacing={"-0.5px"}
            fontSize={"1.4rem"}
            lineHeight={"100%"}
            fontColor={theme.colors.text.title}
          >
            Bem-vindo de volta
          </Text>
          <Text fontSize={"1rem"} fontColor={theme.colors.text.muted}>
            Entre para ver as contas do mês.
          </Text>
        </Container>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorBanner>{error}</ErrorBanner>}
          <Input
            {...inputStyle}
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            withIcon
            icon={<PiEnvelopeSimple />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            {...inputStyle}
            mask="password"
            placeholder="Senha"
            autoComplete="current-password"
            withIcon
            icon={<PiLockSimple />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PillButton type="submit" $full disabled={loading}>
            <PiUserCheckFill />
            {loading ? "Entrando..." : "Entrar"}
          </PillButton>
          <Muted style={{ textAlign: "center" }}>
            Não tem conta?{" "}
            <Link to="/register" style={{ color: theme.colors.primaryHover }}>
              Criar conta
            </Link>
          </Muted>
        </Form>
      </Container>
    </Container>
  );
};

export default Login;
