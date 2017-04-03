import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import Rnd from 'react-rnd';

export default class SceneEditorTimelineItem extends Component {

  static propTypes = {
    editorDurationWidth: PropTypes.number.isRequired,
    media: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    relation: PropTypes.object.isRequired,
    scale: PropTypes.number.isRequired,
    scaling: PropTypes.number.isRequired,
    updateRelation: PropTypes.func.isRequired,
  }

  /* évite de render chaque item de la timeline à chaque mise à jours de l'interval
   * quand la scène est en lécture.
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.relation === nextProps.relation
        && this.props.editorDurationWidth === nextProps.editorDurationWidth
        && this.props.scaling === nextProps.scaling)
      return false;
    else
      return true;
  }

  render() {

    const relation            = this.props.relation;
    const media               = this.props.media;
    const scaling             = this.props.scaling;
    const editorDurationWidth = this.props.editorDurationWidth;
    const scale               = this.props.scale;
    const x                   = Math.round(relation.startTimeOffset / scaling * editorDurationWidth);
    const y                   = relation.zIndex * 50;
    const width               = Math.max(Math.round(relation.duration / scaling * editorDurationWidth), 30);

    return (
        <Rnd
          className="editor-separation-element"
          initial={{
            x: x,
            y: y,
            width: width,
            height: 43,
          }}
          resizeGrid={[editorDurationWidth / (scaling / scale), 1]}
          moveGrid={[editorDurationWidth / (scaling / scale), 50]}
          bounds={'parent'}
          isResizable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          onClick={() => this.props.onClick(relation.idRelation)}
          onDragStop={(event, ui, a) => {
            const newStart = Math.round((ui.position.left / editorDurationWidth * scaling) / scale) * scale;
            const newZindex = Math.round((ui.position.top / 150 * 150) / 50);
            console.log(newZindex);
            this.props.updateRelation(relation.idRelation, {startTimeOffset: newStart, zIndex: newZindex});
          }}
          onResizeStop={(direction, styleSize, clientSize) => {
            const newDuration = Math.round((clientSize.width / editorDurationWidth * scaling) / scale) * scale;
            this.props.updateRelation(relation.idRelation, {duration: newDuration});
          }}
          >
          <div>
            <ul>
              <li>{media.name}</li>
              <li>{relation.startTimeOffset / 1000} : Décalage (s)</li>
              <li>{relation.duration == 0 ? <span>&infin;</span> : relation.duration / 1000}: Durée (s)</li>
            </ul>
            <Button title="Réinitialiser la durée" size="small" shape="circle" icon="reload"
              onClick={() => {
                const initDuration = media.duration == 0 ? 60000 : media.duration;
                this.props.updateRelation(relation.idRelation, {duration: initDuration});
              }}
            />
          </div>
        </Rnd>
    );
  }
}
