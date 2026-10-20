import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiUser,
  FiMail,
  FiLock,
  FiDollarSign,
  FiHome,
  FiAlertCircle,
  FiKey,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { media } from "../../styles/medias";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${media.mobile} {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  color: ${({ theme }) => theme.colors.text.title};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.title};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 1.125rem;
  }
`;

const Input = styled.input`
  width: 100%;
  color: ${({ theme }) => theme.colors.text.light};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

const RadioButton = styled.button<{ $active: boolean }>`
  padding: 0.65rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : theme.colors.surfaceLight};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: all 0.2s ease;
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.light};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: background-color 0.2s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.secondaryHover};
    font-weight: ${({ theme }) => theme.fontWeights.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [houseOption, setHouseOption] = useState<"new" | "existing">("new");
  const [houseName, setHouseName] = useState("");
  const [houseId, setHouseId] = useState("");

  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await register({
        name,
        email,
        password,
        monthlyIncome: Number(monthlyIncome),
        pixKey: pixKey.trim() ? pixKey : undefined,
        houseName: houseOption === "new" ? houseName : undefined,
        houseId: houseOption === "existing" ? houseId : undefined,
      });

      navigate("/");
    } catch {
      return;
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <Title>Cadastro</Title>
          <Subtitle>Crie seu perfil e configure a sua casa no Bills</Subtitle>
        </Header>

        {error && (
          <ErrorBanner>
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </ErrorBanner>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Seu Nome</Label>
            <InputContainer>
              <FiUser />
              <Input
                id="name"
                type="text"
                placeholder="Ex: Pedro Paulo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">E-mail</Label>
            <InputContainer>
              <FiMail />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <InputContainer>
              <FiLock />
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="income">Renda Mensal Declarada (R$)</Label>
            <InputContainer>
              <FiDollarSign />
              <Input
                id="income"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="pixKey">Chave Pix (Opcional)</Label>
            <InputContainer>
              <FiKey />
              <Input
                id="pixKey"
                type="text"
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label>Vínculo da Casa</Label>
            <RadioGroup>
              <RadioButton
                type="button"
                $active={houseOption === "new"}
                onClick={() => setHouseOption("new")}
              >
                Criar Nova Casa
              </RadioButton>
              <RadioButton
                type="button"
                $active={houseOption === "existing"}
                onClick={() => setHouseOption("existing")}
              >
                Entrar em Casa Existente
              </RadioButton>
            </RadioGroup>
          </InputGroup>

          {houseOption === "new" ? (
            <InputGroup>
              <Label htmlFor="houseName">Nome da Casa</Label>
              <InputContainer>
                <FiHome />
                <Input
                  id="houseName"
                  type="text"
                  placeholder="Ex: Casa Principal"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  required
                />
              </InputContainer>
            </InputGroup>
          ) : (
            <InputGroup>
              <Label htmlFor="houseId">Código da Casa (UUID)</Label>
              <InputContainer>
                <FiHome />
                <Input
                  id="houseId"
                  type="text"
                  placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
                  value={houseId}
                  onChange={(e) => setHouseId(e.target.value)}
                  required
                />
              </InputContainer>
            </InputGroup>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Concluir Cadastro"}
          </SubmitButton>
        </Form>

        <FooterText>
          Já tem conta? <Link to="/login">Fazer login</Link>
        </FooterText>
      </Card>
    </Container>
  );
};

export default Register;
