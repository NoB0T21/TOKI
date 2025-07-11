
'use client'

import { UserContext } from '@/context/context'

const ClientUserProvider = ({ children, value }: { children: React.ReactNode; value: any }) => {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default ClientUserProvider;