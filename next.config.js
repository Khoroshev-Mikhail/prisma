module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/osv/bp',
          permanent: true,
        },
      ]
    },
  }