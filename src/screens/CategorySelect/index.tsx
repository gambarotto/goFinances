import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import ButtonForm from '../../components/Forms/ButtonForm';
import { categories } from '../../utils/categories';
import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

interface Category {
  key: string;
  name: string;
}
interface Props {
  category: Category;
  // eslint-disable-next-line no-unused-vars
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

const CategorySelect: React.FC<Props> = ({
  category,
  setCategory,
  closeSelectCategory,
}) => {
  const handleSelectCategory = useCallback(
    (item: Category) => {
      setCategory(item);
    },
    [setCategory],
  );

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleSelectCategory(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
      <Footer>
        <ButtonForm title="Selecionar" onPress={closeSelectCategory} />
      </Footer>
    </Container>
  );
};

export default CategorySelect;
