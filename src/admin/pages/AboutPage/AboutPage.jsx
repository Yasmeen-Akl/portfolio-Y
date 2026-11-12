import { useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import { TextField } from '../../components/Field/Field.jsx';
import ChipInput from '../../components/ChipInput/ChipInput.jsx';
import ImageField from '../../components/ImageField/ImageField.jsx';
import { profileOnly, profileSetter } from '../shared.js';

export default function AboutPage() {
  const editor = useEditor(profileOnly.load, profileOnly.persist);

  return (
    <Page title="About" intro="The “Who I am” section. Its four pinned notes are edited under Stats." editor={editor}>
      {({ profile }, change) => {
        const set = profileSetter(change);
        return (
          <>
            <Panel title="Text">
              <TextField
                label="Heading"
                value={profile.about_heading}
                onChange={set('about_heading')}
                hint="Wrap the accent part in asterisks: Designing with *Purpose.*"
              />
              <ChipInput
                multiline
                label="Paragraphs"
                values={profile.about_paragraphs}
                onChange={set('about_paragraphs')}
                hint="The first paragraph is the large lead. In it, wrap words in ==double equals== to highlight them."
              />
            </Panel>
            <Panel title="Polaroid photo">
              <ImageField
                label="About photo"
                section="about"
                value={profile.about_photo_url}
                onChange={set('about_photo_url')}
              />
              <TextField
                label="Caption under the photo"
                value={profile.about_photo_caption}
                onChange={set('about_photo_caption')}
              />
            </Panel>
          </>
        );
      }}
    </Page>
  );
}
