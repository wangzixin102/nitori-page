import { getSession } from 'next-auth/react';

export const ensureLoggedIn = async (req: any) => {
  const session = await getSession({ req });

  if (!session) {
    return { user: null, loggedIn: false };
  }

  return { user: session.user, loggedIn: true };
};
