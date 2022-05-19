import { autoUpdate, computePosition, flip, hide, offset, shift } from "@floating-ui/dom";
import { combineProps } from "@solid-primitives/props";
import { mergeRefs } from "@solid-primitives/refs";
import { access } from "@solid-primitives/utils";
import { Accessor, createMemo, JSX, Ref, splitProps } from "solid-js";
import { render, Show } from "solid-js/web";

import {
  AriaOverlayProps,
  createButton,
  createDialog,
  createModal,
  createOverlay,
  createOverlayTrigger,
  DismissButton,
  FocusScope,
  OverlayContainer,
  OverlayProvider
} from "../src";

interface PopoverProps extends AriaOverlayProps {
  ref: Ref<HTMLDivElement | undefined>;
  title?: JSX.Element;
  children?: JSX.Element;
  style?: any;
}

function Popover(props: PopoverProps) {
  let ref: HTMLDivElement | undefined;

  const [local, others] = splitProps(props, [
    "ref",
    "title",
    "children",
    "isOpen",
    "onClose",
    "style"
  ]);

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const { overlayProps } = createOverlay(
    {
      onClose: local.onClose,
      isOpen: () => access(local.isOpen),
      isDismissable: true
    },
    () => ref
  );

  // Hide content outside the modal from screen readers.
  const { modalProps } = createModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = createDialog({}, () => ref);

  const rootProps = createMemo(() => {
    return combineProps(overlayProps(), dialogProps(), modalProps(), others);
  });

  return (
    <FocusScope restoreFocus>
      <div
        {...rootProps()}
        ref={mergeRefs(el => (ref = el), local.ref)}
        style={{
          position: "absolute",
          background: "white",
          color: "black",
          padding: "30px",
          "max-width": "300px",
          ...local.style
        }}
      >
        <h3 {...titleProps} style={{ "margin-top": 0 }}>
          {props.title}
        </h3>
        {props.children}
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  );
}

function createFloating<T extends HTMLElement, U extends HTMLElement>(
  referenceElement: Accessor<T | undefined>,
  floatingElement: Accessor<U | undefined>
) {
  let cleanupPopoverAutoUpdate: (() => void) | undefined;

  async function updatePopoverPosition() {
    const refEl = referenceElement();
    const floatingEl = floatingElement();

    if (!refEl || !floatingEl) {
      return;
    }

    const { x, y, middlewareData } = await computePosition(refEl, floatingEl, {
      placement: "right",
      middleware: [offset(), flip(), hide(), shift()]
    });

    if (!floatingEl) {
      return;
    }

    const referenceHidden = middlewareData.hide?.referenceHidden;

    Object.assign(floatingEl.style, {
      left: `${Math.round(x)}px`,
      top: `${Math.round(y)}px`,
      visibility: referenceHidden ? "hidden" : "visible"
    });
  }

  const onOpen = () => {
    const refEl = referenceElement();
    const floatingEl = floatingElement();

    if (!refEl || !floatingEl) {
      return;
    }

    // schedule auto update of the popover position
    cleanupPopoverAutoUpdate = autoUpdate(refEl, floatingEl, updatePopoverPosition);
  };

  const onClose = () => {
    cleanupPopoverAutoUpdate?.();
  };

  return { onOpen, onClose };
}

function Example() {
  let triggerRef: HTMLButtonElement | undefined;
  let overlayRef: HTMLDivElement | undefined;

  // Get props for the trigger and overlay.
  const { triggerProps, overlayProps, state } = createOverlayTrigger({ type: "dialog" });

  // Get popover positioning props relative to the trigger
  const { onOpen, onClose } = createFloating(
    () => triggerRef,
    () => overlayRef
  );

  // createButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // popover closes.
  const { buttonProps } = createButton(
    {
      onPress: () => {
        state.open();
        onOpen();
      }
    },
    () => triggerRef
  );

  const closePopover = () => {
    onClose();
    state.close();
  };

  return (
    <>
      <button {...buttonProps()} {...triggerProps()} ref={triggerRef}>
        Open Popover
      </button>
      <Show when={state.isOpen()}>
        <OverlayContainer>
          <Popover
            {...overlayProps()}
            ref={overlayRef}
            title="Popover title"
            isOpen={state.isOpen()}
            onClose={closePopover}
          >
            This is the content of the popover.
          </Popover>
        </OverlayContainer>
      </Show>
    </>
  );
}

function App() {
  return (
    // Application must be wrapped in an OverlayProvider so that it can be
    // hidden from screen readers when an overlay opens.
    <OverlayProvider>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis exercitationem totam sequi
        quis ullam itaque consequatur enim dicta mollitia repellat nihil placeat vitae ad, minima
        praesentium numquam maxime voluptatibus omnis iste odit aperiam error quae! Dicta quasi
        ipsam, doloribus ex assumenda dolorum sapiente sed nobis neque ipsa sunt quaerat amet eius
        nesciunt consectetur perspiciatis nemo eveniet doloremque a enim! Dolor, reiciendis. Quam
        illo alias consequatur accusantium quae, eligendi aspernatur? Laudantium officia ex natus
        magnam, vitae itaque. Dolor, distinctio eligendi, molestiae inventore eum perspiciatis
        deserunt mollitia velit quis nulla, est incidunt. Nisi iusto facilis at quibusdam
        recusandae! Dicta asperiores obcaecati dolore corrupti dolorum labore fugiat eaque quaerat,
        magnam mollitia quam adipisci eveniet nulla. Neque provident inventore numquam obcaecati?
        Necessitatibus dolores animi similique quasi laborum cum cupiditate voluptatem molestias.
        Debitis vero veritatis ratione voluptas. Doloribus vero facere inventore, ratione nihil
        optio architecto repellendus laborum necessitatibus, mollitia reiciendis. Exercitationem
        beatae quam veritatis, doloremque animi eveniet sit dignissimos quae! Tenetur cum quos saepe
        sed! Inventore repudiandae sapiente vero placeat amet, alias voluptatum odit reprehenderit
        accusantium accusamus deserunt eius vel fugit atque exercitationem nobis vitae, nesciunt
        sunt, officiis praesentium magni harum delectus. Nostrum, quae ratione culpa quia nisi
        officiis quidem voluptate deserunt iste, ipsa placeat labore veniam sint corporis veritatis
        perspiciatis reiciendis. Voluptatem a esse nemo dicta corporis ipsam repellat, facere
        accusamus alias? Placeat ipsum, magni cupiditate repudiandae consectetur nobis? Eos,
        quibusdam atque modi enim recusandae deleniti quia, blanditiis laudantium vitae ea ullam
        eius, unde vel perspiciatis at minima corporis magni rem! Assumenda nam voluptatum fuga esse
        sequi? Animi hic quisquam doloribus porro laborum dolores voluptatum possimus placeat maxime
        sit. Hic quae repellat nulla sint labore. Excepturi minus dolor cupiditate veritatis quasi.
        Minus debitis sit ducimus vero, quae veritatis tempore aspernatur facilis! Quam impedit
        tempore eligendi qui laudantium a, velit ducimus incidunt nisi corporis dicta accusamus
        deleniti hic aut? Voluptatem, ipsum, nemo enim nostrum dolore assumenda tenetur nam a
        mollitia soluta corrupti ea eveniet, maiores pariatur ab. Obcaecati consequatur, quidem quae
        maxime explicabo, nulla assumenda porro ipsum quis molestias ad perspiciatis laboriosam
        saepe, recusandae placeat maiores cupiditate eveniet ratione sunt. Odit in fuga unde
        consequatur facilis, ducimus earum cupiditate et, animi itaque, quas aliquid. Facilis
        dolorum sunt soluta, beatae optio quam at accusantium aut veniam molestias, similique dolore
        itaque tenetur rem tempore odit! Non nihil eveniet laudantium asperiores ipsa, ex, sunt
        accusamus veritatis distinctio delectus cum molestiae! Dolore, labore! Magnam qui numquam
        officia sit iure excepturi inventore deleniti perspiciatis sapiente cumque, sed eveniet
        quisquam dolorum expedita ratione! Eaque molestiae porro tempora voluptas? Illo expedita
        quaerat nulla ea dignissimos voluptate aut in, praesentium ducimus dicta omnis rem
        distinctio dolores eum deserunt qui! Ullam quidem, recusandae impedit saepe magni temporibus
        dignissimos dolore, rem, vel omnis quaerat error molestias veniam ab cupiditate
        exercitationem explicabo corporis ipsa fuga amet iste minus delectus aliquam repellat. Modi
        iure animi veritatis, harum explicabo eum. Suscipit nulla rerum repellat praesentium quidem
        aperiam, aliquid illum! Explicabo est laborum ad alias error illum doloribus facere officia
        voluptatum! Maxime velit inventore doloremque esse perspiciatis. Quod dignissimos voluptatem
        commodi eos sequi odio suscipit placeat reiciendis repudiandae. Ab pariatur totam autem
        laudantium voluptatum nostrum nihil esse reiciendis repellendus ad eligendi natus quisquam,
        at ut aperiam animi doloremque. Quas ut dolorum eos amet assumenda, magnam rem animi
        asperiores dignissimos sapiente, adipisci explicabo quibusdam ipsum cum, praesentium
        expedita inventore possimus tempora quod! Excepturi ullam cumque fugit ut expedita ad,
        voluptates minima quidem aliquid modi ex suscipit facere pariatur officiis ipsam
        voluptatibus neque. Nam non, nulla accusantium incidunt veniam ipsa cupiditate itaque,
        consequatur iste dignissimos quae dolore, aperiam asperiores voluptatum quaerat voluptatibus
        tenetur excepturi numquam sint. Quas ullam enim voluptate error esse laudantium itaque
        sequi. Nulla est explicabo blanditiis facere id sapiente dolores quo dolorum tenetur
        possimus ut recusandae exercitationem numquam corporis vel, quod, expedita earum. Aliquid
        illo at fugiat velit, nisi facere unde suscipit recusandae, facilis error est voluptate,
        ducimus saepe eos! Eveniet reiciendis explicabo ipsam nulla ab consequatur corrupti placeat
        voluptas, sunt quibusdam ea praesentium nesciunt dignissimos fuga nemo impedit amet beatae
        repellat molestiae, quae quaerat iste error officiis rem! Deserunt suscipit quia dolore,
        sint quasi esse voluptate, porro nesciunt beatae facilis quas inventore ratione eius. Nobis
        dolorum aspernatur ipsa nulla incidunt ad, ut inventore consequuntur maiores hic veritatis
        cum nam odit itaque distinctio, qui ab nemo? Error labore impedit commodi. Fugiat, quisquam
        tempora! Consectetur eaque perspiciatis aliquid enim maxime tempore blanditiis obcaecati,
        quas accusamus voluptatum. Quod eveniet, culpa commodi omnis laborum exercitationem harum
        veniam molestias beatae fuga aliquam vero ipsam reprehenderit ea iure neque necessitatibus
        vel? Dolorem nihil molestiae velit omnis ipsam eos veritatis? Delectus rerum maiores fugiat,
        harum, cumque aliquam doloremque, ipsa quisquam deleniti natus unde inventore quo sequi.
        Autem temporibus sunt reiciendis et laboriosam corrupti at inventore illum. Distinctio
        numquam optio asperiores placeat molestias corporis ipsam, non impedit enim maiores,
        repellendus aperiam architecto voluptatem quos voluptatum iusto minima! Ratione suscipit
        quidem nesciunt, veritatis maxime magni, nostrum, velit harum corporis consectetur hic omnis
        voluptas excepturi neque sunt quam commodi? Reiciendis nemo dolorum laudantium ipsum
        veritatis facilis sunt sit a autem? Fugit incidunt voluptatem error autem, doloribus
        molestias ab repudiandae labore possimus nemo rerum quas suscipit eveniet dolore aperiam
        porro perferendis iste illum non! Natus, voluptatem perferendis. Animi reprehenderit
        voluptatibus explicabo deleniti saepe aperiam placeat illo est dolores ullam. Sapiente
        consectetur perferendis quia neque consequuntur ab eum fugit libero ex animi accusantium at
        rem enim deleniti aspernatur, possimus, exercitationem amet delectus minima praesentium
        quam. Pariatur labore cumque reprehenderit nesciunt, vitae ullam necessitatibus consectetur
        ducimus aut eaque ratione minima! Nobis aut nostrum similique id culpa ratione molestias
        minima soluta, itaque incidunt accusantium non dicta sed necessitatibus quidem quae suscipit
        debitis, mollitia sint eligendi, exercitationem praesentium repellendus? Hic, voluptates
        perferendis! Perferendis, voluptatibus! Maiores voluptatum soluta laboriosam commodi
        recusandae molestias odit est inventore quos sit ut nostrum, eligendi eveniet consequuntur,
        vel dolor laborum assumenda doloremque! Dolore dolores nihil soluta delectus ullam, officiis
        neque deserunt quos eius natus omnis, quisquam architecto enim dignissimos. Commodi dolor,
        doloribus quia numquam facere, fugit iure, voluptas explicabo quos maiores totam omnis?
        Molestias accusamus laborum et molestiae, nobis aliquam a excepturi libero culpa magni
        dolores doloribus incidunt veniam dignissimos vitae tempore ipsum, ea quae enim. Tempore
        maxime, provident ullam nihil iusto ab qui dolorum, voluptatum sint necessitatibus pariatur
        delectus sit eaque quis consequuntur? Cumque sunt amet sed, quisquam iusto libero voluptas
        eum voluptate vero qui ea tempora recusandae assumenda cupiditate ducimus facere aliquam
        commodi facilis placeat deleniti, iure ex, delectus vel tempore! Iste omnis distinctio esse
        laboriosam ab alias odit sequi, amet perferendis quo! Eligendi repellendus praesentium non
        veniam mollitia accusamus ab, reprehenderit commodi consectetur architecto unde, placeat
        porro. Ratione sapiente ut enim culpa laudantium esse labore blanditiis placeat consequuntur
        nisi voluptatem cumque, aliquam natus officia libero autem impedit distinctio sequi, veniam
        nostrum ullam eos debitis eum. Neque dolorem deleniti enim perferendis asperiores atque nisi
        nihil assumenda, sunt doloremque quidem ullam possimus error, voluptatem dolorum natus,
        perspiciatis laborum nesciunt a. Molestiae repellat sunt iusto cupiditate incidunt
        voluptates et similique, delectus cumque ipsam perspiciatis qui quos quas deleniti minima
        earum voluptas doloremque veritatis. Suscipit iusto ut mollitia veritatis. Molestiae magni
        tempora iste, rem nam perspiciatis quam quod maxime odit veniam obcaecati ratione sint
        facere ut ab aperiam, labore dicta laboriosam, quos quo. Laboriosam, quae quos! Quisquam
        iusto, animi porro corrupti nostrum laborum officia quos nobis ipsam distinctio non eos
        saepe, ex incidunt omnis eius nulla explicabo nam maxime asperiores expedita debitis.
        Impedit culpa dignissimos repudiandae et accusantium! Nihil repellat pariatur ab voluptate
        incidunt ratione molestiae consectetur, maxime ipsa enim non? Enim atque accusantium ducimus
        odit nam similique vero provident alias voluptatum reprehenderit vitae optio eius ad
        consectetur impedit ea aut facilis porro quaerat, adipisci nisi vel deserunt! Quis illum,
        aut at ipsum sapiente minus hic eveniet maiores iure labore, omnis rerum dolores facere
        voluptatibus? Veniam dicta impedit voluptates vero accusantium illum amet voluptatibus,
        veritatis quae earum rerum minus esse! Explicabo facere dolore commodi voluptate totam
        similique harum sed fugiat, unde ratione. Pariatur quas dignissimos natus, asperiores sunt
        nihil ab quaerat perferendis ea. Dolor voluptatem pariatur officiis reprehenderit eum
        repellat in, sapiente tempora eligendi sed ex. Minima repudiandae aperiam debitis quasi, sit
        suscipit aspernatur doloremque reprehenderit explicabo numquam sequi rerum, repellat
        molestiae voluptatum corporis repellendus quas. Eligendi eius ipsam similique nobis expedita
        nemo. Pariatur voluptates dolorum, ut distinctio dolorem quod voluptatum maxime eaque
        consequatur debitis repudiandae quas labore molestiae laboriosam quasi deleniti laudantium
        molestias possimus vitae, beatae tempora nulla magnam ratione iusto? Facilis ipsa eum velit
        placeat sed sequi optio deleniti illum incidunt temporibus eveniet nemo amet et suscipit
        distinctio eius, iste at eos similique ipsam quam. Aspernatur illum mollitia sit officiis
        laudantium quisquam velit quaerat cumque atque quo dolore, eius quod sapiente minus!
        Veritatis, similique quod velit doloribus quisquam neque ab blanditiis iure eveniet dolorum
        consequuntur modi voluptatem dolorem. Excepturi quaerat voluptates sapiente, sint quos
        labore qui, velit accusamus veniam error eveniet a eligendi natus magnam totam inventore?
        Nihil laborum repellendus laboriosam eius harum similique quaerat! Tenetur nihil maxime
        dolor, consectetur voluptatem, mollitia aspernatur nemo natus, iste expedita harum sequi
        iusto assumenda velit? Quidem, atque facilis repellendus voluptatem ullam reiciendis.
        Officia, quod ipsum placeat fuga dolorem corporis similique natus modi repellat minus
        consequatur impedit qui commodi recusandae tempore delectus odit cupiditate magni?
        Aspernatur maiores, earum quasi perferendis perspiciatis inventore molestiae possimus. Eaque
        autem, unde, nostrum repudiandae, dolorum consequatur ipsa est sequi labore nam aliquam.
        Nihil sed, itaque, ad assumenda repudiandae, molestias ut quos quis fugiat accusantium
        voluptas! Tempora eius cum mollitia doloribus. Minus temporibus eligendi reprehenderit qui
        commodi officia velit nostrum aliquid voluptatibus quidem est sit in totam sequi, sapiente
        quo id natus ullam necessitatibus accusantium placeat? Cupiditate itaque saepe quas sapiente
        obcaecati debitis quo. Amet culpa excepturi dolorem recusandae ratione ipsam blanditiis
        minus, vitae, cupiditate iure laborum rerum, fugiat sequi maiores totam ab aliquam error
        doloribus? Repellendus neque dicta, corporis quia distinctio totam consequatur dolore ad
        laboriosam quis quaerat commodi minus earum, ut nostrum eum fuga ratione maiores dolorem ab
        a vero dolorum veritatis cum? Provident culpa vero cupiditate, corporis perferendis rem
        quidem! Ea, maiores? Distinctio, tenetur esse vero reiciendis cumque sed ab quas beatae
        quam, rerum repudiandae facere corrupti. Nostrum, a provident aperiam animi voluptatibus
        assumenda deserunt dolores iste, quidem iure quo recusandae eveniet, ipsam ut nihil suscipit
        omnis aut eaque placeat doloribus. Molestiae atque voluptates dolores eligendi, quibusdam
        officia asperiores inventore ducimus iure delectus odit voluptate id voluptatibus laudantium
        incidunt aperiam cumque. Praesentium tenetur iste vitae voluptatem odit, minus harum
        obcaecati perferendis rem similique voluptates nostrum doloribus alias, eos nemo eum,
        tempore facilis. Blanditiis voluptate harum iusto laboriosam in perferendis pariatur earum
        quo. Commodi, perspiciatis dolores fuga accusantium molestiae atque omnis corporis voluptate
        ea, rem aliquam in eligendi illum eius, animi distinctio aliquid voluptates hic. Id,
        similique excepturi, repellendus inventore odio suscipit mollitia molestiae libero
        repudiandae, ipsa tenetur accusantium quo laudantium quidem! Numquam non nihil fuga
        accusantium fugiat iusto praesentium sequi, quaerat cupiditate vel et, nesciunt eius
        voluptates exercitationem minus voluptatibus ut deserunt rem sunt amet autem quae quis!
        Unde, autem temporibus assumenda dignissimos quisquam consequatur recusandae non aperiam
        molestiae necessitatibus dicta tempore a fuga dolorum accusamus aspernatur. Architecto fuga
        reprehenderit aperiam eaque neque similique totam incidunt obcaecati suscipit reiciendis
        omnis adipisci ut deleniti esse necessitatibus qui distinctio, commodi at corporis
        perferendis laudantium blanditiis sint. Ipsam autem debitis maiores atque quia aspernatur
        ullam nisi quasi eveniet corporis recusandae sunt, suscipit sequi similique maxime
        voluptates consequatur fugiat consequuntur ipsum eius culpa. Cum ad ipsum itaque molestias
        distinctio ea vitae consequatur rem, vero ullam iste tenetur iure maxime sit. Pariatur
        repudiandae harum autem quis quibusdam. Amet velit, iure quod consectetur magnam perferendis
        cupiditate nihil fugiat excepturi non id incidunt eveniet a in! Ea ut temporibus rem,
        consectetur ab id iure quibusdam illum ducimus delectus accusamus in inventore dignissimos
        expedita quo illo quia accusantium! Saepe asperiores aperiam id impedit soluta sit numquam
        atque blanditiis, voluptate molestias quibusdam earum laudantium perferendis, fuga tenetur
        totam voluptates! Hic error magnam omnis fugit unde dicta esse, sint enim, rerum nam aliquam
        incidunt velit voluptate natus corrupti earum aut delectus quo. Sapiente ex repellat
        doloremque, quos corporis eligendi obcaecati vitae hic ipsam quis!
      </p>
      <Example />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis exercitationem totam sequi
        quis ullam itaque consequatur enim dicta mollitia repellat nihil placeat vitae ad, minima
        praesentium numquam maxime voluptatibus omnis iste odit aperiam error quae! Dicta quasi
        ipsam, doloribus ex assumenda dolorum sapiente sed nobis neque ipsa sunt quaerat amet eius
        nesciunt consectetur perspiciatis nemo eveniet doloremque a enim! Dolor, reiciendis. Quam
        illo alias consequatur accusantium quae, eligendi aspernatur? Laudantium officia ex natus
        magnam, vitae itaque. Dolor, distinctio eligendi, molestiae inventore eum perspiciatis
        deserunt mollitia velit quis nulla, est incidunt. Nisi iusto facilis at quibusdam
        recusandae! Dicta asperiores obcaecati dolore corrupti dolorum labore fugiat eaque quaerat,
        magnam mollitia quam adipisci eveniet nulla. Neque provident inventore numquam obcaecati?
        Necessitatibus dolores animi similique quasi laborum cum cupiditate voluptatem molestias.
        Debitis vero veritatis ratione voluptas. Doloribus vero facere inventore, ratione nihil
        optio architecto repellendus laborum necessitatibus, mollitia reiciendis. Exercitationem
        beatae quam veritatis, doloremque animi eveniet sit dignissimos quae! Tenetur cum quos saepe
        sed! Inventore repudiandae sapiente vero placeat amet, alias voluptatum odit reprehenderit
        accusantium accusamus deserunt eius vel fugit atque exercitationem nobis vitae, nesciunt
        sunt, officiis praesentium magni harum delectus. Nostrum, quae ratione culpa quia nisi
        officiis quidem voluptate deserunt iste, ipsa placeat labore veniam sint corporis veritatis
        perspiciatis reiciendis. Voluptatem a esse nemo dicta corporis ipsam repellat, facere
        accusamus alias? Placeat ipsum, magni cupiditate repudiandae consectetur nobis? Eos,
        quibusdam atque modi enim recusandae deleniti quia, blanditiis laudantium vitae ea ullam
        eius, unde vel perspiciatis at minima corporis magni rem! Assumenda nam voluptatum fuga esse
        sequi? Animi hic quisquam doloribus porro laborum dolores voluptatum possimus placeat maxime
        sit. Hic quae repellat nulla sint labore. Excepturi minus dolor cupiditate veritatis quasi.
        Minus debitis sit ducimus vero, quae veritatis tempore aspernatur facilis! Quam impedit
        tempore eligendi qui laudantium a, velit ducimus incidunt nisi corporis dicta accusamus
        deleniti hic aut? Voluptatem, ipsum, nemo enim nostrum dolore assumenda tenetur nam a
        mollitia soluta corrupti ea eveniet, maiores pariatur ab. Obcaecati consequatur, quidem quae
        maxime explicabo, nulla assumenda porro ipsum quis molestias ad perspiciatis laboriosam
        saepe, recusandae placeat maiores cupiditate eveniet ratione sunt. Odit in fuga unde
        consequatur facilis, ducimus earum cupiditate et, animi itaque, quas aliquid. Facilis
        dolorum sunt soluta, beatae optio quam at accusantium aut veniam molestias, similique dolore
        itaque tenetur rem tempore odit! Non nihil eveniet laudantium asperiores ipsa, ex, sunt
        accusamus veritatis distinctio delectus cum molestiae! Dolore, labore! Magnam qui numquam
        officia sit iure excepturi inventore deleniti perspiciatis sapiente cumque, sed eveniet
        quisquam dolorum expedita ratione! Eaque molestiae porro tempora voluptas? Illo expedita
        quaerat nulla ea dignissimos voluptate aut in, praesentium ducimus dicta omnis rem
        distinctio dolores eum deserunt qui! Ullam quidem, recusandae impedit saepe magni temporibus
        dignissimos dolore, rem, vel omnis quaerat error molestias veniam ab cupiditate
        exercitationem explicabo corporis ipsa fuga amet iste minus delectus aliquam repellat. Modi
        iure animi veritatis, harum explicabo eum. Suscipit nulla rerum repellat praesentium quidem
        aperiam, aliquid illum! Explicabo est laborum ad alias error illum doloribus facere officia
        voluptatum! Maxime velit inventore doloremque esse perspiciatis. Quod dignissimos voluptatem
        commodi eos sequi odio suscipit placeat reiciendis repudiandae. Ab pariatur totam autem
        laudantium voluptatum nostrum nihil esse reiciendis repellendus ad eligendi natus quisquam,
        at ut aperiam animi doloremque. Quas ut dolorum eos amet assumenda, magnam rem animi
        asperiores dignissimos sapiente, adipisci explicabo quibusdam ipsum cum, praesentium
        expedita inventore possimus tempora quod! Excepturi ullam cumque fugit ut expedita ad,
        voluptates minima quidem aliquid modi ex suscipit facere pariatur officiis ipsam
        voluptatibus neque. Nam non, nulla accusantium incidunt veniam ipsa cupiditate itaque,
        consequatur iste dignissimos quae dolore, aperiam asperiores voluptatum quaerat voluptatibus
        tenetur excepturi numquam sint. Quas ullam enim voluptate error esse laudantium itaque
        sequi. Nulla est explicabo blanditiis facere id sapiente dolores quo dolorum tenetur
        possimus ut recusandae exercitationem numquam corporis vel, quod, expedita earum. Aliquid
        illo at fugiat velit, nisi facere unde suscipit recusandae, facilis error est voluptate,
        ducimus saepe eos! Eveniet reiciendis explicabo ipsam nulla ab consequatur corrupti placeat
        voluptas, sunt quibusdam ea praesentium nesciunt dignissimos fuga nemo impedit amet beatae
        repellat molestiae, quae quaerat iste error officiis rem! Deserunt suscipit quia dolore,
        sint quasi esse voluptate, porro nesciunt beatae facilis quas inventore ratione eius. Nobis
        dolorum aspernatur ipsa nulla incidunt ad, ut inventore consequuntur maiores hic veritatis
        cum nam odit itaque distinctio, qui ab nemo? Error labore impedit commodi. Fugiat, quisquam
        tempora! Consectetur eaque perspiciatis aliquid enim maxime tempore blanditiis obcaecati,
        quas accusamus voluptatum. Quod eveniet, culpa commodi omnis laborum exercitationem harum
        veniam molestias beatae fuga aliquam vero ipsam reprehenderit ea iure neque necessitatibus
        vel? Dolorem nihil molestiae velit omnis ipsam eos veritatis? Delectus rerum maiores fugiat,
        harum, cumque aliquam doloremque, ipsa quisquam deleniti natus unde inventore quo sequi.
        Autem temporibus sunt reiciendis et laboriosam corrupti at inventore illum. Distinctio
        numquam optio asperiores placeat molestias corporis ipsam, non impedit enim maiores,
        repellendus aperiam architecto voluptatem quos voluptatum iusto minima! Ratione suscipit
        quidem nesciunt, veritatis maxime magni, nostrum, velit harum corporis consectetur hic omnis
        voluptas excepturi neque sunt quam commodi? Reiciendis nemo dolorum laudantium ipsum
        veritatis facilis sunt sit a autem? Fugit incidunt voluptatem error autem, doloribus
        molestias ab repudiandae labore possimus nemo rerum quas suscipit eveniet dolore aperiam
        porro perferendis iste illum non! Natus, voluptatem perferendis. Animi reprehenderit
        voluptatibus explicabo deleniti saepe aperiam placeat illo est dolores ullam. Sapiente
        consectetur perferendis quia neque consequuntur ab eum fugit libero ex animi accusantium at
        rem enim deleniti aspernatur, possimus, exercitationem amet delectus minima praesentium
        quam. Pariatur labore cumque reprehenderit nesciunt, vitae ullam necessitatibus consectetur
        ducimus aut eaque ratione minima! Nobis aut nostrum similique id culpa ratione molestias
        minima soluta, itaque incidunt accusantium non dicta sed necessitatibus quidem quae suscipit
        debitis, mollitia sint eligendi, exercitationem praesentium repellendus? Hic, voluptates
        perferendis! Perferendis, voluptatibus! Maiores voluptatum soluta laboriosam commodi
        recusandae molestias odit est inventore quos sit ut nostrum, eligendi eveniet consequuntur,
        vel dolor laborum assumenda doloremque! Dolore dolores nihil soluta delectus ullam, officiis
        neque deserunt quos eius natus omnis, quisquam architecto enim dignissimos. Commodi dolor,
        doloribus quia numquam facere, fugit iure, voluptas explicabo quos maiores totam omnis?
        Molestias accusamus laborum et molestiae, nobis aliquam a excepturi libero culpa magni
        dolores doloribus incidunt veniam dignissimos vitae tempore ipsum, ea quae enim. Tempore
        maxime, provident ullam nihil iusto ab qui dolorum, voluptatum sint necessitatibus pariatur
        delectus sit eaque quis consequuntur? Cumque sunt amet sed, quisquam iusto libero voluptas
        eum voluptate vero qui ea tempora recusandae assumenda cupiditate ducimus facere aliquam
        commodi facilis placeat deleniti, iure ex, delectus vel tempore! Iste omnis distinctio esse
        laboriosam ab alias odit sequi, amet perferendis quo! Eligendi repellendus praesentium non
        veniam mollitia accusamus ab, reprehenderit commodi consectetur architecto unde, placeat
        porro. Ratione sapiente ut enim culpa laudantium esse labore blanditiis placeat consequuntur
        nisi voluptatem cumque, aliquam natus officia libero autem impedit distinctio sequi, veniam
        nostrum ullam eos debitis eum. Neque dolorem deleniti enim perferendis asperiores atque nisi
        nihil assumenda, sunt doloremque quidem ullam possimus error, voluptatem dolorum natus,
        perspiciatis laborum nesciunt a. Molestiae repellat sunt iusto cupiditate incidunt
        voluptates et similique, delectus cumque ipsam perspiciatis qui quos quas deleniti minima
        earum voluptas doloremque veritatis. Suscipit iusto ut mollitia veritatis. Molestiae magni
        tempora iste, rem nam perspiciatis quam quod maxime odit veniam obcaecati ratione sint
        facere ut ab aperiam, labore dicta laboriosam, quos quo. Laboriosam, quae quos! Quisquam
        iusto, animi porro corrupti nostrum laborum officia quos nobis ipsam distinctio non eos
        saepe, ex incidunt omnis eius nulla explicabo nam maxime asperiores expedita debitis.
        Impedit culpa dignissimos repudiandae et accusantium! Nihil repellat pariatur ab voluptate
        incidunt ratione molestiae consectetur, maxime ipsa enim non? Enim atque accusantium ducimus
        odit nam similique vero provident alias voluptatum reprehenderit vitae optio eius ad
        consectetur impedit ea aut facilis porro quaerat, adipisci nisi vel deserunt! Quis illum,
        aut at ipsum sapiente minus hic eveniet maiores iure labore, omnis rerum dolores facere
        voluptatibus? Veniam dicta impedit voluptates vero accusantium illum amet voluptatibus,
        veritatis quae earum rerum minus esse! Explicabo facere dolore commodi voluptate totam
        similique harum sed fugiat, unde ratione. Pariatur quas dignissimos natus, asperiores sunt
        nihil ab quaerat perferendis ea. Dolor voluptatem pariatur officiis reprehenderit eum
        repellat in, sapiente tempora eligendi sed ex. Minima repudiandae aperiam debitis quasi, sit
        suscipit aspernatur doloremque reprehenderit explicabo numquam sequi rerum, repellat
        molestiae voluptatum corporis repellendus quas. Eligendi eius ipsam similique nobis expedita
        nemo. Pariatur voluptates dolorum, ut distinctio dolorem quod voluptatum maxime eaque
        consequatur debitis repudiandae quas labore molestiae laboriosam quasi deleniti laudantium
        molestias possimus vitae, beatae tempora nulla magnam ratione iusto? Facilis ipsa eum velit
        placeat sed sequi optio deleniti illum incidunt temporibus eveniet nemo amet et suscipit
        distinctio eius, iste at eos similique ipsam quam. Aspernatur illum mollitia sit officiis
        laudantium quisquam velit quaerat cumque atque quo dolore, eius quod sapiente minus!
        Veritatis, similique quod velit doloribus quisquam neque ab blanditiis iure eveniet dolorum
        consequuntur modi voluptatem dolorem. Excepturi quaerat voluptates sapiente, sint quos
        labore qui, velit accusamus veniam error eveniet a eligendi natus magnam totam inventore?
        Nihil laborum repellendus laboriosam eius harum similique quaerat! Tenetur nihil maxime
        dolor, consectetur voluptatem, mollitia aspernatur nemo natus, iste expedita harum sequi
        iusto assumenda velit? Quidem, atque facilis repellendus voluptatem ullam reiciendis.
        Officia, quod ipsum placeat fuga dolorem corporis similique natus modi repellat minus
        consequatur impedit qui commodi recusandae tempore delectus odit cupiditate magni?
        Aspernatur maiores, earum quasi perferendis perspiciatis inventore molestiae possimus. Eaque
        autem, unde, nostrum repudiandae, dolorum consequatur ipsa est sequi labore nam aliquam.
        Nihil sed, itaque, ad assumenda repudiandae, molestias ut quos quis fugiat accusantium
        voluptas! Tempora eius cum mollitia doloribus. Minus temporibus eligendi reprehenderit qui
        commodi officia velit nostrum aliquid voluptatibus quidem est sit in totam sequi, sapiente
        quo id natus ullam necessitatibus accusantium placeat? Cupiditate itaque saepe quas sapiente
        obcaecati debitis quo. Amet culpa excepturi dolorem recusandae ratione ipsam blanditiis
        minus, vitae, cupiditate iure laborum rerum, fugiat sequi maiores totam ab aliquam error
        doloribus? Repellendus neque dicta, corporis quia distinctio totam consequatur dolore ad
        laboriosam quis quaerat commodi minus earum, ut nostrum eum fuga ratione maiores dolorem ab
        a vero dolorum veritatis cum? Provident culpa vero cupiditate, corporis perferendis rem
        quidem! Ea, maiores? Distinctio, tenetur esse vero reiciendis cumque sed ab quas beatae
        quam, rerum repudiandae facere corrupti. Nostrum, a provident aperiam animi voluptatibus
        assumenda deserunt dolores iste, quidem iure quo recusandae eveniet, ipsam ut nihil suscipit
        omnis aut eaque placeat doloribus. Molestiae atque voluptates dolores eligendi, quibusdam
        officia asperiores inventore ducimus iure delectus odit voluptate id voluptatibus laudantium
        incidunt aperiam cumque. Praesentium tenetur iste vitae voluptatem odit, minus harum
        obcaecati perferendis rem similique voluptates nostrum doloribus alias, eos nemo eum,
        tempore facilis. Blanditiis voluptate harum iusto laboriosam in perferendis pariatur earum
        quo. Commodi, perspiciatis dolores fuga accusantium molestiae atque omnis corporis voluptate
        ea, rem aliquam in eligendi illum eius, animi distinctio aliquid voluptates hic. Id,
        similique excepturi, repellendus inventore odio suscipit mollitia molestiae libero
        repudiandae, ipsa tenetur accusantium quo laudantium quidem! Numquam non nihil fuga
        accusantium fugiat iusto praesentium sequi, quaerat cupiditate vel et, nesciunt eius
        voluptates exercitationem minus voluptatibus ut deserunt rem sunt amet autem quae quis!
        Unde, autem temporibus assumenda dignissimos quisquam consequatur recusandae non aperiam
        molestiae necessitatibus dicta tempore a fuga dolorum accusamus aspernatur. Architecto fuga
        reprehenderit aperiam eaque neque similique totam incidunt obcaecati suscipit reiciendis
        omnis adipisci ut deleniti esse necessitatibus qui distinctio, commodi at corporis
        perferendis laudantium blanditiis sint. Ipsam autem debitis maiores atque quia aspernatur
        ullam nisi quasi eveniet corporis recusandae sunt, suscipit sequi similique maxime
        voluptates consequatur fugiat consequuntur ipsum eius culpa. Cum ad ipsum itaque molestias
        distinctio ea vitae consequatur rem, vero ullam iste tenetur iure maxime sit. Pariatur
        repudiandae harum autem quis quibusdam. Amet velit, iure quod consectetur magnam perferendis
        cupiditate nihil fugiat excepturi non id incidunt eveniet a in! Ea ut temporibus rem,
        consectetur ab id iure quibusdam illum ducimus delectus accusamus in inventore dignissimos
        expedita quo illo quia accusantium! Saepe asperiores aperiam id impedit soluta sit numquam
        atque blanditiis, voluptate molestias quibusdam earum laudantium perferendis, fuga tenetur
        totam voluptates! Hic error magnam omnis fugit unde dicta esse, sint enim, rerum nam aliquam
        incidunt velit voluptate natus corrupti earum aut delectus quo. Sapiente ex repellat
        doloremque, quos corporis eligendi obcaecati vitae hic ipsam quis!
      </p>
    </OverlayProvider>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
