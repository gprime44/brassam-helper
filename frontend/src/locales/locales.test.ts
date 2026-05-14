import { describe, it, expect } from 'vitest';
import fr from './fr.json';
import en from './en.json';

describe('Locales JSON structure', () => {
  it('fr.json should be a valid JSON and have required sections', () => {
    expect(fr).toBeDefined();
    expect(fr.common).toBeDefined();
    expect(fr.inventory).toBeDefined();
  });

  it('en.json should be a valid JSON and have required sections', () => {
    expect(en).toBeDefined();
    expect(en.common).toBeDefined();
    expect(en.inventory).toBeDefined();
  });
});
