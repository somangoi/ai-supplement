import { FlatList, Linking, Alert } from "react-native";
import styled from "@emotion/native";
import { Supplement, SupplementResponse } from "@/features/supplement-advisor/types/schemas";
import { theme } from "@/shared/styles/theme";
import { Button } from "@/shared/components/Button";
import Typography from "@/shared/components/Typography";

interface ResultProps {
  result: SupplementResponse;
  userName?: string;
  onReset: () => void;
}

const Result = ({ result, userName, onReset }: ResultProps) => {
  const supplements = result.recommendations;
  const disclaimer = result.disclaimer;

  const handlePurchaseLink = async (url: string, productName: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      Alert.alert("오류", "링크를 여는 중 문제가 발생했습니다.");
    }
  };

  const renderSupplement = ({ item }: { item: Supplement }) => (
    <Card>
      <SupplementName>💊 {item.name}</SupplementName>

      <InfoRow>
        <Label>· 1일 섭취량:</Label>
        <Value>{item.dosage}</Value>
      </InfoRow>
      <InfoRow>
        <Label>· 1일 섭취 횟수:</Label>
        <Value>{item.frequency}</Value>
      </InfoRow>
      <InfoRow>
        <Label>· 섭취 시간:</Label>
        <Value>{item.timing}</Value>
      </InfoRow>
      <Reason>{item.reason}</Reason>

      {item.productName && (
        <>
          <Divider />
          <ProductSection>
            <ProductInfoRow>
              <ProductInfo>
                <ProductLabel>🛒 추천 제품</ProductLabel>
                <ProductName>{item.productName}</ProductName>
              </ProductInfo>
              {item.purchaseUrl && (
                <PurchaseButton onPress={() => handlePurchaseLink(item.purchaseUrl!, item.productName || item.name)}>
                  <PurchaseButtonText>구매하기</PurchaseButtonText>
                </PurchaseButton>
              )}
            </ProductInfoRow>
          </ProductSection>
        </>
      )}
    </Card>
  );
  return (
    <Container>
      <Title>{userName ? `${userName}님을 위한 추천 영양제` : "추천 영양제"}</Title>
      {disclaimer && (
        <DisclaimerBox>
          <Typography text="⚠️" name="sm" color={theme.colors.warning} />
          <Typography text={disclaimer} name="sm" color={theme.colors.textSecondary} containerStyle={{ flexGrow: 1, width: "90%" }} />
        </DisclaimerBox>
      )}
      <FlatList data={supplements} renderItem={renderSupplement} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} />
      <Button title="다시 진행하기" onPress={onReset} style={{ marginTop: 12 }} />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: ${theme.spacing.md};
`;

const Title = styled.Text`
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`;

const DisclaimerBox = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  background-color: ${theme.colors.warning}20;
  border-left-width: 4px;
  border-left-color: ${theme.colors.warning};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.sm};
`;

const Card = styled.View`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
`;

const SupplementName = styled.Text`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const InfoRow = styled.View`
  flex-direction: row;
  margin-bottom: ${theme.spacing.xs};
  gap: ${theme.spacing.xs};
`;

const Label = styled.Text`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.textSecondary};
`;

const Value = styled.Text`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text};
  flex: 1;
`;

const Reason = styled.Text`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.sm};
  line-height: 20px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.primary}20;
  margin: ${theme.spacing.md} 0;
`;

const ProductSection = styled.View`
  padding-top: ${theme.spacing.xs};
`;

const ProductInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const ProductInfo = styled.View`
  flex: 1;
`;

const ProductLabel = styled.Text`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const ProductName = styled.Text`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
`;

const PurchaseButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 8px 12px;
  border-radius: ${theme.borderRadius.sm};
  align-items: center;
  justify-content: center;
`;

const PurchaseButtonText = styled.Text`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.surface};
`;

export default Result;
