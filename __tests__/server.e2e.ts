import axios from 'axios';
import { AmbassadorTestkit } from '@wix/ambassador-testkit';
import { NodeWorkshopScalaApp } from '@wix/ambassador-node-workshop-scala-app/rpc';
import { aComment } from '@wix/ambassador-node-workshop-scala-app/builders';

describe('API integration tests', () => {
  const ambassadorTestkit = new AmbassadorTestkit(); // create new instance of the testkit
  ambassadorTestkit.beforeAndAfter(); // register its before and after handlers

  it('list comments', async () => {
    const siteId = '1234';
    const url = app.getUrl(`/comments/${siteId}`);

    const comment = aComment().withAuthor('an author').withText('some text...').build();
    const comments = [comment];

    ambassadorTestkit
      .createStub(NodeWorkshopScalaApp)
      .CommentsService()
      .fetch.when(siteId)
      .resolve(comments);

    const response = await axios.get(url);
    expect(response.data).toEqual(comments);
  });


  it('should post a new message to server', async () => {
    const siteId = '1234';
    const url = app.getUrl(`/comment/${siteId}`);
    const comment = aComment().withAuthor('an author').withText('some text...').build();

    let actualSiteId, actualComment;
    ambassadorTestkit
      .createStub(NodeWorkshopScalaApp)
      .CommentsService().add.when((_siteId,_comment)=>{
        actualSiteId = _siteId;
        actualComment = _comment;
        return true;
      }).resolve(null);

      await axios.post(url,comment);

      expect(actualSiteId).toEqual(siteId);
      expect(actualComment).toEqual(comment);
  })
});
