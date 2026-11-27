import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  EnvelopeSimple,
  HouseLine,
  Key,
  LockSimple,
  User,
  UserPlus,
  WarningCircle,
} from "@phosphor-icons/react";
import billsLogo from "../../assets/logos/bills-logo.svg";
import {
  Card,
  ErrorBanner,
  Field,
  Form,
  Image,
  Input,
  MoneyInput,
  Muted,
  PillButton,
  Segmented,
  SegmentButton,
} from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { parseMoney } from "../../utils/format";

const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: calc(2rem + env(safe-area-inset-top)) 1.25rem 2rem;
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 460px;
  padding: 1.75rem 1.4rem;
  gap: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  h1 {
    font-size: 1.6rem;
    letter-spacing: -0.03em;
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
        monthlyIncome: parseMoney(monthlyIncome),
        pixKey: pixKey.trim() ? pixKey : undefined,
        houseName: houseOption === "new" ? houseName : undefined,
        houseId: houseOption === "existing" ? houseId.trim() : undefined,
      });

      navigate("/home");
    } catch {
      return;
    }
  };

  return (
    <Page>
      <Image
        src={billsLogo}
        alt="Bills"
        width={60}
        height={60}
        objectFit="contain"
      />
      <Panel>
        <Header>
          <h1>Criar conta</h1>
          <Muted>Crie seu perfil e configure a sua casa no Bills.</Muted>
        </Header>

        {error && (
          <ErrorBanner style={{ display: "flex", gap: "0.5rem" }}>
            <WarningCircle weight="fill" size={18} />
            <span>{error}</span>
          </ErrorBanner>
        )}

        <Form onSubmit={handleSubmit} disabled={loading}>
          <Field>
            Seu nome
            <Input
              placeholder="Seu nome"
              autoComplete="name"
              withIcon
              icon={<User />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field>
            E-mail
            <Input
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              withIcon
              icon={<EnvelopeSimple />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            Senha
            <Input
              mask="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              withIcon
              icon={<LockSimple />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Field>
            Renda fixa mensal
            <MoneyInput
              required
              value={monthlyIncome}
              onChange={setMonthlyIncome}
            />
          </Field>

          <Field>
            Chave Pix (opcional)
            <Input
              placeholder="CPF, e-mail, telefone ou aleatória"
              withIcon
              icon={<Key />}
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
          </Field>

          <Field as="div">
            Casa
            <Segmented>
              <SegmentButton
                type="button"
                $active={houseOption === "new"}
                onClick={() => setHouseOption("new")}
              >
                Criar nova
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={houseOption === "existing"}
                onClick={() => setHouseOption("existing")}
              >
                Já existe
              </SegmentButton>
            </Segmented>
          </Field>

          {houseOption === "new" ? (
            <Field>
              Nome da casa
              <Input
                placeholder="Ex: Casa Principal"
                withIcon
                icon={<HouseLine />}
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                required
              />
            </Field>
          ) : (
            <Field>
              Código da casa
              <Input
                placeholder="Cole o código que te enviaram"
                withIcon
                icon={<HouseLine />}
                value={houseId}
                onChange={(e) => setHouseId(e.target.value)}
                required
              />
            </Field>
          )}

          <PillButton type="submit" $full disabled={loading}>
            <UserPlus weight="fill" />
            {loading ? "Cadastrando..." : "Concluir cadastro"}
          </PillButton>
        </Form>

        <Muted style={{ textAlign: "center" }}>
          Já tem conta? <Link to="/login">Fazer login</Link>
        </Muted>
      </Panel>
    </Page>
  );
};

export default Register;
