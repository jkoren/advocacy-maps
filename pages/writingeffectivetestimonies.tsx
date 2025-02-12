import { Container } from "../components/bootstrap"
import { createPage } from "../components/page"
import WritingEffectiveTestimoniesCard from "../components/WritingEffectiveTestimonies/WritingEffectiveTestimoniesCard"
import WritingEffectiveTestimoniesCardContent from "../components/WritingEffectiveTestimonies/WritingEffectiveTestimoniesCardContent"
import styles from "../components/WritingEffectiveTestimonies/WritingEffectiveTestimoniesCard.module.css"

const content = [
  {
    title: "Be Timely",
    paragraph: {
      P1: `Written testimony should be targeted towards specific bills being considered by the legislature. All Committees should formally accept testimony on each bill in the time between the start of the legislative session and the public hearing of that bill.
            Some committees will continue accepting testimony after the hearing date, but it may not have the same impact on their deliberations.`
    },
    src: "Leg+Clock.png",
    alt: "Document with clock"
  },
  {
    title: "Be Original",
    paragraph: {
      P1: `Legislators receive a lot of form letters and repeated sentiments from organized groups of constituents. These communications are important and their volume can be meaningful to legislators. But, almost always, an individual and personalized letter will have a greater impact.`
    },
    src: "Leg+Lightbulb.png",
    alt: "Document with clock"
  },
  {
    title: "Be Informative",
    paragraph: {
      P1: `Whether you are a longtime advocate or a first time testifier, whether you have a doctoral degree in the subject or lived experience regarding a policy, and no matter your age, race, creed, or background, your testimony is important. Explain why you are concerned about an issue and why you think one policy choice would be better than another. For example, your being a parent gives you special insight into education policy, your living in a community affected by pollution gives you special insight into environmental policy, etc.`
    },
    src: "Writing.png",
    alt: "Document with clock",
    imgFlag: 1
  },
  {
    title: "Be Direct",
    paragraph: {
      P1: `State whether you support or oppose a bill. Be clear and specific about the policies you want to see. You don't have to know specific legal precedents or legislative language; just explain what you would like to happen and why.`
    },
    src: "Opinions.png",
    alt: "Document with clock"
  },
  {
    title: "Be Respectful",
    paragraph: {
      P1: `No matter how strongly and sincerely held your position is, there may be people of good intent who feel oppositely and expect and deserve to have their opinions considered by their legislators also. Respectful testimony will carry more weight with legislators, especially those who you may need to persuade to your side of an issue.`
    },
    src: "RespectWithBlob.png",
    alt: "Document with clock"
  }
]

export default createPage({
  title: "Writing Effective Testimonies",
  Page: () => {
    return (
      <Container fluid="md" className="mt-3">
        <h1 className={styles.title}>Writing Effective Testimony</h1>
        <p className={styles.subheader}>
          The basics of writing effective testimony are to clearly outline what
          bill you are testifying about, whether you support or oppose it, why
          you are concerned about the issue, what policy you would like to see
          enacted, and what legislative district you live in. Here are some tips
          you can use to make sure the testimony you submit is as impactful as
          possible:
        </p>
        {content.map((value, index) => (
          <WritingEffectiveTestimoniesCard
            title={value.title}
            key={value.title}
          >
            <WritingEffectiveTestimoniesCardContent
              src={value.src}
              alt={value.alt}
              index={index}
            >
              {value.paragraph}
            </WritingEffectiveTestimoniesCardContent>
          </WritingEffectiveTestimoniesCard>
        ))}
      </Container>
    )
  }
})
