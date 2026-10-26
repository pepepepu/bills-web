import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { media } from "../../styles/medias";
import billsLogo from "../../assets/logos/bills-logo.svg";
import { Container, Button, Image, Input, Text } from "../../components";

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  ${media.mobile} {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.dangerLight};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SubmitButton = styled(Button)`
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const FooterContainer = styled.div`
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.secondaryHover};
    font-weight: ${({ theme }) => theme.fontWeights.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

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
      navigate("/");
    } catch {
      return;
    }
  };

  return (
    <Container
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="1.5rem"
      backgroundColor={theme.colors.background}
    >
      <Card>
        <Header>
          <Image
            src={billsLogo}
            alt="Bills Logo"
            width={48}
            height={48}
            margin="0 0 0.5rem 0"
            objectFit="contain"
          />
          <Text
            as="h1"
            fontSize={theme.fontSizes["3xl"]}
            fontColor={theme.colors.text.title}
            fontWeight={theme.fontWeights.bold}
          >
            Bills
          </Text>
          <Text
            as="p"
            fontSize={theme.fontSizes.sm}
            fontColor={theme.colors.text.muted}
          >
            Acesse sua conta para gerenciar as finanças da casa
          </Text>
        </Header>

        {error && (
          <ErrorBanner>
            <FiAlertCircle size={18} />
            <Text
              as="span"
              fontSize={theme.fontSizes.sm}
              fontColor={theme.colors.danger}
            >
              {error}
            </Text>
          </ErrorBanner>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Text
              as="label"
              fontSize={theme.fontSizes.sm}
              fontWeight={theme.fontWeights.medium}
              fontColor={theme.colors.text.title}
            >
              E-mail
            </Text>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              withIcon
              icon={<FiMail />}
              backgroundColor={theme.colors.surfaceLight}
              border={`1px solid ${theme.colors.border}`}
              onFocusBorderColor={theme.colors.primary}
              textColor={theme.colors.text.light}
              placeholderColor={theme.colors.text.muted}
              fontSize={theme.fontSizes.sm}
              padding="0.75rem 1rem"
              required
            />
          </InputGroup>

          <InputGroup>
            <Text
              as="label"
              fontSize={theme.fontSizes.sm}
              fontWeight={theme.fontWeights.medium}
              fontColor={theme.colors.text.title}
            >
              Senha
            </Text>
            <Input
              id="password"
              mask="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              withIcon
              icon={<FiLock />}
              backgroundColor={theme.colors.surfaceLight}
              border={`1px solid ${theme.colors.border}`}
              onFocusBorderColor={theme.colors.primary}
              textColor={theme.colors.text.light}
              placeholderColor={theme.colors.text.muted}
              fontSize={theme.fontSizes.sm}
              padding="0.75rem 1rem"
              required
            />
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={loading}
            width="100%"
            padding="0.875rem"
            backgroundColor={theme.colors.primary}
            color={theme.colors.text.light}
            borderRadius={theme.radius.md}
            fontWeight={theme.fontWeights.semibold}
            fontSize={theme.fontSizes.md}
          >
            {loading ? "Entrando..." : "Entrar no Bills"}
          </SubmitButton>
        </Form>

        <FooterContainer>
          <Text
            as="span"
            fontSize={theme.fontSizes.sm}
            fontColor={theme.colors.text.muted}
          >
            Não possui uma conta? <Link to="/register">Cadastre-se</Link>
          </Text>
        </FooterContainer>
      </Card>
    </Container>
  );
};

export default Login;
