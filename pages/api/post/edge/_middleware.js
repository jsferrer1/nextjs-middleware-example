
export async function middleware(req, ev) {
    console.log('edge middleware: check auth and params')
    // check the auth
    const basicAuth = req.headers.get('authorization')
    console.log('basicAuth: ', basicAuth)
    let authRequired = true
    if (basicAuth) {
        const auth = basicAuth.split(' ')[1]
        const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')

        if (user === 'admin' && pwd === 'password') {
            authRequired = false
        }
    }

    if (authRequired) {
      return new Response('Auth required', {
          status: 401,
          headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
          },
      })
    }

    // check the params
    const url = req.nextUrl;
    let postId = null;
    url.searchParams.forEach((val, key) => {
        if (key === "postId") {
            postId = val;
            return;
        }
    });

    if (!postId) {
        return new Response(JSON.stringify({ error: "postId is required" }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    } else {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      const post = await response.json();

      return new Response(JSON.stringify({ title: post.title }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
}