module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/osv/mrp',
          permanent: true,
        },
      ]
    },
  }