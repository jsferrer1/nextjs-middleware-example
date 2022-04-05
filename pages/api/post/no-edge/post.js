export default async function handler(req, res) {
    console.log('no-edge handler: req: ', req.headers)

    // check the auth
    const basicAuth = 'Basic YWRtaW46cGFzc3dvcmQ=' // req.headers.get('authorization')
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
    const { postId } = req.query;

    if (!postId) {
      res.status(500).json({ error: "postId is required" });
    } else {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      const post = await response.json();

      res.status(200).json({ title: post.title });
    }
  }