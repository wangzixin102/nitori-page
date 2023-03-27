import { useRouter } from 'next/router'

const Recommendation = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Post: dynamic {id}</p>
};

export default Recommendation;