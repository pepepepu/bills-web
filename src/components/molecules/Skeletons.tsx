import { Card, Skeleton, Stat, TotalsGrid } from "./ui";
import styled from "styled-components";

const SkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 0;
`;

const SkCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

/** Linhas de lista carregando. */
export const ListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div aria-busy="true" aria-label="Carregando">
    {Array.from({ length: rows }).map((_, i) => (
      <SkRow key={i} style={{ opacity: 1 - i * 0.15 }}>
        <Skeleton $w="26px" $h="26px" $round />
        <SkCol>
          <Skeleton $w={`${55 + ((i * 17) % 30)}%`} />
          <Skeleton $w="30%" $h="0.7rem" />
        </SkCol>
        <Skeleton $w="72px" />
      </SkRow>
    ))}
  </div>
);

/** Card inteiro carregando. */
export const CardSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <Card>
    <Skeleton $w="40%" $h="1.1rem" />
    <ListSkeleton rows={rows} />
  </Card>
);

/** Valor de um Stat carregando. */
export const StatValueSkeleton = ({ light }: { light?: boolean }) => (
  <Skeleton
    $w="70%"
    $h="1.4rem"
    style={light ? { filter: "invert(1)", opacity: 0.5 } : undefined}
  />
);

/** Grade de totais carregando. */
export const TotalsSkeleton = ({ count = 2 }: { count?: number }) => (
  <TotalsGrid>
    {Array.from({ length: count }).map((_, i) => (
      <Stat key={i}>
        <Skeleton $w="50%" $h="0.7rem" />
        <Skeleton $w="75%" $h="1.4rem" />
      </Stat>
    ))}
  </TotalsGrid>
);
