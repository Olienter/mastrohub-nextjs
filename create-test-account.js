const { createClient } = require('@supabase/supabase-js');

// Supabase configuration (using mock values for development)
const supabaseUrl = 'https://mock-project.supabase.co';
const supabaseAnonKey = 'mock-anon-key-for-development';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestAccount() {
  try {
    console.log('🔄 Creating test account...');
    
    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@test.com',
      password: 'kokot',
      options: {
        data: {
          username: 'Admin',
          full_name: 'Test Administrator'
        }
      }
    });

    if (authError) {
      console.error('❌ Auth Error:', authError.message);
      return;
    }

    if (authData.user) {
      console.log('✅ Test account created successfully!');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Password: kokot');
      console.log('👤 Username: Admin');
      console.log('🆔 User ID:', authData.user.id);
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: 'admin@test.com',
          username: 'Admin',
          full_name: 'Test Administrator',
          role: 'admin',
          subscription_status: 'premium'
        });

      if (profileError) {
        console.log('⚠️ Profile creation error (this is normal for mock setup):', profileError.message);
      } else {
        console.log('✅ Profile created successfully!');
      }
      
      console.log('\n🎯 Test Account Ready!');
      console.log('🌐 Go to: http://localhost:3000/register');
      console.log('📝 Login with: admin@test.com / kokot');
      
    } else {
      console.log('⚠️ Account creation pending email verification');
    }
    
  } catch (error) {
    console.error('❌ Error creating test account:', error.message);
  }
}

// Run the script
createTestAccount();
