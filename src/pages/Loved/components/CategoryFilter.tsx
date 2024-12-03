import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background.secondary};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.3s ease;
  font-size: 0.9375rem;
  text-transform: capitalize;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.background.primary};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <FilterContainer>
      <FilterButton
        $active={selectedCategory === 'all'}
        onClick={() => onSelectCategory('all')}
      >
        All
      </FilterButton>
      {categories.map(category => (
        <FilterButton
          key={category}
          $active={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default CategoryFilter;