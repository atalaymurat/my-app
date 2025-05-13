import { cookies } from 'next/headers';

const BaseIndex = async () => {
  const cookiesList = await cookies(); // cookies() asenkron olduğu için await edilmesi gerekiyor
  const token = cookiesList.get('_server_token')?.value; // Tokeni alıyoruz
  console.log('BaseIndex Page Server Side Token:', token);

  if (!token) {
    // Token yoksa başka bir işlem yapabilirsiniz
    return <div>No Token Found</div>;
  }

  return (
    <div>
      {/* Token bulunduğunda gösterilecek içerik */}
      <pre className='text-white'>

      Token: {JSON.stringify(token, null, 2)}
      </pre>
    </div>
  );
};

export default BaseIndex;
