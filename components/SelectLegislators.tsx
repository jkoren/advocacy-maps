import AwesomeDebouncePromise from "awesome-debounce-promise"
import Fuse from "fuse.js"
import { useMemo } from "react"
import { GroupBase } from "react-select"
import AsyncSelect, { AsyncProps } from "react-select/async"
import { Form, Row, Spinner } from "./bootstrap"
import {
  MemberSearchIndex,
  MemberSearchIndexItem,
  ProfileHook,
  ProfileMember,
  useMemberSearch,
  useProfile
} from "./db"

const SelectLegislators: React.FC = () => {
  const { index, loading: searchLoading } = useMemberSearch(),
    profile = useProfile(),
    loading = profile.loading || searchLoading

  return loading ? (
    <Row>
      <Spinner animation="border" className="mx-auto" />
    </Row>
  ) : (
    <LegislatorForm profile={profile} index={index!} />
  )
}

const LegislatorForm: React.FC<{
  index: MemberSearchIndex
  profile: ProfileHook
}> = ({ index, profile }) => {
  return (
    <Form>
      <Form.Group className="mb-4">
        <Form.Label>Representative</Form.Label>
        <Search
          placeholder="Search your representative"
          index={index.representatives}
          isLoading={profile.updatingRep}
          memberId={profile.profile?.representative?.id}
          update={profile.updateRep}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Senator</Form.Label>
        <Search
          placeholder="Search your senator"
          index={index.senators}
          isLoading={profile.updatingSenator}
          memberId={profile.profile?.senator?.id}
          update={profile.updateSenator}
        />
      </Form.Group>
    </Form>
  )
}

type SearchProps = {
  index: MemberSearchIndexItem[]
  update: (member: ProfileMember | null) => void
  memberId: string | undefined
} & AsyncProps<MemberSearchIndexItem, false, GroupBase<MemberSearchIndexItem>>

const Search: React.FC<SearchProps> = ({
  index,
  update,
  memberId,
  ...props
}) => {
  const byId = useMemo(
    () => Object.fromEntries(index.map(m => [m.MemberCode, m])),
    [index]
  )

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "Name", weight: 2 },
          { name: "District", weight: 1 },
          { name: "EmailAddress", weight: 0.5 },
          { name: "MemberCode", weight: 0.5 }
        ]
      }),
    [index]
  )

  const loadOptions = useMemo(
    () =>
      AwesomeDebouncePromise(async (value: string) => {
        return fuse
          .search(value, { limit: 10 })
          .map(({ refIndex }) => index[refIndex])
      }, 100),
    [fuse, index]
  )

  return (
    <AsyncSelect
      isClearable
      defaultOptions={index}
      getOptionLabel={o => `${o.Name} | ${o.District}`}
      getOptionValue={o => o.MemberCode}
      value={memberId === undefined ? undefined : byId[memberId]}
      onChange={value => {
        if (value) {
          update({
            id: value.MemberCode,
            district: value.District,
            name: value.Name
          })
        } else {
          update(null)
        }
      }}
      loadOptions={loadOptions}
      {...props}
    />
  )
}

export default SelectLegislators
