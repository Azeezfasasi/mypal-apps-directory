'use client';

import { ProfileProvider } from '../../assets/contextAPI/ProfileContext.js';
import { TenantProvider } from '../../assets/contextAPI/TenantContext.js';
import { TenantAppProvider } from '../../assets/contextAPI/AppContext.js';
import { TenantCategoryProvider } from '../../assets/contextAPI/TenantCategoryContext.js';

export function ClientProviders({ children }) {
  return (
    <ProfileProvider>
      <TenantProvider>
        <TenantAppProvider>
          <TenantCategoryProvider>
            {children}
          </TenantCategoryProvider>
        </TenantAppProvider>
      </TenantProvider>
    </ProfileProvider>
  );
}

