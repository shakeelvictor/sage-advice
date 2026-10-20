import styled from 'styled-components';
import { Chip } from '../../../components/ui';

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => (
  <Row role="group" aria-label="Filter by category">
    <Chip $active={selectedCategory === 'all'} onClick={() => onSelectCategory('all')} aria-pressed={selectedCategory === 'all'}>
      All
    </Chip>
    {categories.map((category) => (
      <Chip key={category} $active={selectedCategory === category} onClick={() => onSelectCategory(category)} aria-pressed={selectedCategory === category}>
        {category}
      </Chip>
    ))}
  </Row>
);

export default CategoryFilter;
