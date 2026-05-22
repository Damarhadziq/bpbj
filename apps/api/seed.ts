import { auth } from './src/auth/auth';
import { db } from './src/config/db';
import { user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log("Seeding superadmin account...");
  
  try {
    // We use Better Auth's API to ensure the password is hashed correctly
    const existingUser = await db.select().from(user).where(eq(user.email, 'superadmin@semarangkota.go.id'));
    
    if (existingUser.length > 0) {
      console.log("Superadmin already exists!");
    } else {
      // Create user using Better Auth server action. Wait, better-auth doesn't have signUpEmail exposed on the core auth instance in this environment easily without a request context.
      // Actually, it's easier to just insert a manually hashed password if we know the hashing method, or use the node API.
      // Better-Auth provides a way to register via its node client. But let's just do an insert with a dummy password if we use a specific hashing algorithm, or we can use the `better-auth` client.
    }
  } catch(e) {
    console.error(e);
  }
}

seed();
