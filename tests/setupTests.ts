import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// extends Vitest's expect with jest-dom's matchers like toBeInTheDocument
expect.extend(matchers);
